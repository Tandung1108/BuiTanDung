#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <ctime>
#include <iomanip>
#include <algorithm>
#include <thread>
#include <chrono>

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

using namespace std;

// Cấu trúc cho một Tác vụ (Task)
struct Task {
    int id;
    string text;
    bool completed;
};

// Danh sách tác vụ toàn cục
vector<Task> tasks;
const string DATA_FILE = "tasks_data.txt";

// Hàm xóa màn hình (tương thích đa nền tảng)
void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

// Hiệu ứng "loading" hoặc đánh máy cho sinh động
void printCyberLoading(string msg) {
    cout << msg;
    for (int i = 0; i < 3; ++i) {
        cout << ".";
        cout.flush();
        this_thread::sleep_for(chrono::milliseconds(200));
    }
    cout << endl;
}

// 1. Đọc dữ liệu từ file (Thay thế LocalStorage)
void loadTasks() {
    ifstream file(DATA_FILE);
    if (!file.is_open()) return;

    tasks.clear();
    int id;
    bool completed;
    string text;
    while (file >> id >> completed) {
        file.ignore(); // Bỏ qua ký tự xuống dòng
        getline(file, text);
        tasks.push_back({id, text, completed});
    }
    file.close();
}

// 2. Lưu dữ liệu vào file (Thay thế LocalStorage)
void saveTasks() {
    ofstream file(DATA_FILE);
    for (const auto& t : tasks) {
        file << t.id << " " << t.completed << "\n" << t.text << "\n";
    }
    file.close();
}

// Lấy thời gian thực
string getCurrentTime() {
    time_t now = time(0);
    tm* ltm = localtime(&now);
    char buf[80];
    strftime(buf, sizeof(buf), "%d/%m/%Y - %H:%M:%S", ltm);
    return string(buf);
}

// Giao diện Header
void printHeader() {
    cout << "\033[1;36m====================================================\033[0m\n";
    cout << "\033[1;35m       [PERSONALIZED AI DASHBOARD - CYBER v1.0]     \033[0m\n";
    cout << "\033[1;36m====================================================\033[0m\n";
    cout << " Chào Phúc, hệ thống đã sẵn sàng.\n";
    cout << " Thời gian thực: " << "\033[1;33m" << getCurrentTime() << "\033[0m\n";
    cout << "\033[1;36m----------------------------------------------------\033[0m\n";
}

// 3. Hiển thị danh sách Task kèm Bộ lọc (Filter)
void renderTasks(string filter = "all") {
    printHeader();
    cout << "\n[ BỘ LỌC HIỆN TẠI: " << filter << " ]\n";
    cout << "----------------------------------------------------\n";

    int count = 0;
    int completedCount = 0;

    for (size_t i = 0; i < tasks.size(); ++i) {
        if (tasks[i].completed) completedCount++;

        // Lọc hiển thị
        if (filter == "active" && tasks[i].completed) continue;
        if (filter == "completed" && !tasks[i].completed) continue;

        count++;
        string status = tasks[i].completed ? "\033[1;32m[ĐÃ XONG]\033[0m" : "\033[1;31m[CHƯA XONG]\033[0m";
        string textDisplay = tasks[i].completed ? "\033[90m" + tasks[i].text + "\033[0m" : tasks[i].text;
        
        cout << " " << i + 1 << ". " << status << " " << textDisplay << " (ID: " << tasks[i].id << ")\n";
    }

    if (count == 0) {
        cout << " \033[33m(Không có tác vụ nào trong danh mục này!)\033[0m\n";
    }

    cout << "----------------------------------------------------\n";
    cout << " Tổng số tác vụ: " << tasks.size() << " | Đã hoàn thành: " << completedCount << "\n";
    cout << "================================================----\n";
}

// 4. Thêm công việc (Có bẫy logic ô trống)
void addTask() {
    cin.ignore();
    string text;
    cout << "\nNhập nội dung tác vụ mới: ";
    getline(cin, text);

    // Bẫy logic 1: Ô input trống
    if (text.empty() || text.find_first_not_of(' ') == string::npos) {
        cout << "\a\033[1;31m⚠️ [CẢNH BÁO AI]: Vui lòng không để trống nội dung tác vụ!\033[0m\n";
        cout << "Nhấn Enter để tiếp tục...";
        cin.get();
        return;
    }

    Task newTask;
    newTask.id = (tasks.empty() ? 1 : tasks.back().id + 1);
    newTask.text = text;
    newTask.completed = false;

    tasks.push_back(newTask);
    saveTasks();
    printCyberLoading("Đang khởi tạo tác vụ vào hệ thống AI");
}

// 5. Đánh dấu hoàn thành (Toggle)
void toggleTask() {
    int index;
    cout << "\nNhập số thứ tự (STT) tác vụ cần đổi trạng thái: ";
    cin >> index;

    if (index >= 1 && index <= (int)tasks.size()) {
        tasks[index - 1].completed = !tasks[index - 1].completed;
        saveTasks();
        cout << "\033[1;32m✨ Cập nhật trạng thái thành công!\033[0m\n";
    } else {
        cout << "\033[1;31m❌ Số thứ tự không hợp lệ!\033[0m\n";
    }
    this_thread::sleep_for(chrono::milliseconds(800));
}

// 6. Xóa công việc
void deleteTask() {
    int index;
    cout << "\nNhập số thứ tự (STT) tác vụ cần xóa: ";
    cin >> index;

    if (index >= 1 && index <= (int)tasks.size()) {
        tasks.erase(tasks.begin() + (index - 1));
        saveTasks();
        cout << "\033[1;31m🗑️ Đã xóa tác vụ khỏi hệ thống!\033[0m\n";
    } else {
        cout << "\033[1;31m❌ Số thứ tự không hợp lệ!\033[0m\n";
    }
    this_thread::sleep_for(chrono::milliseconds(800));
}

// Chương trình chính (Menu tương tác)
int main() {
    #ifdef _WIN32
    SetConsoleOutputCP(65011); // Hỗ trợ hiển thị tiếng Việt và màu sắc UTF-8 trên Windows Terminal
    #endif

    loadTasks();
    string currentFilter = "all";

    while (true) {
        clearScreen();
        renderTasks(currentFilter);

        cout << "\n--- MENU ĐIỀU KHIỂN AI ---";
        cout << "\n1. Thêm tác vụ mới";
        cout << "\n2. Đổi trạng thái hoàn thành (Toggle)";
        cout << "\n3. Xóa tác vụ";
        cout << "\n4. Lọc: Tất cả (All)";
        cout << "\n5. Lọc: Chưa xong (Active)";
        cout << "\n6. Lọc: Đã xong (Completed)";
        cout << "\n0. Thoát chương trình";
        cout << "\n--------------------------";
        cout << "\nLựa chọn của bạn: ";

        int choice;
        cin >> choice;

        if (choice == 0) {
            cout << "\nĐang ngắt kết nối hệ thống AI... Tạm biệt!\n";
            break;
        }

        switch (choice) {
            case 1:
                addTask();
                break;
            case 2:
                toggleTask();
                break;
            case 3:
                deleteTask();
                break;
            case 4:
                currentFilter = "all";
                break;
            case 5:
                currentFilter = "active";
                break;
            case 6:
                currentFilter = "completed";
                break;
            default:
                cout << "\033[1;31mLựa chọn không hợp lệ!\033[0m\n";
                this_thread::sleep_for(chrono::milliseconds(800));
        }
    }

    return 0;
}