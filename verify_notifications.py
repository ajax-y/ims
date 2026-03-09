import requests
import json
import time

BASE_URL = "http://localhost:8000"

def login(username, password):
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": username, "password": password})
    if res.ok:
        return res.json()["access_token"]
    return None

def test_admin_assignment():
    print("\n--- Testing Admin Class Assignment Notification ---")
    admin_token = login("aden", "aden123")
    if not admin_token:
        print("Failed to login as admin. Ensure server is running and seeded.")
        return
    
    # Ideally we'd upload an excel, but we can call the created triggers directly or mock the excel upload
    # For verification, let's create a manual notification to verify the bell icon logic first
    res = requests.post(
        f"{BASE_URL}/notifications/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "title": "Test Assignment",
            "message": "This is a test assignment notification.",
            "recipient_role": "faculty",
            "recipient_id": 2 # Assuming Ajay is ID 2
        }
    )
    if res.ok:
        print("Notification created successfully.")
    else:
        print(f"Failed to create notification: {res.text}")

def test_faculty_attendance():
    print("\n--- Testing Faculty Attendance Notification ---")
    faculty_token = login("ajay", "ajay123")
    if not faculty_token:
        print("Failed to login as faculty.")
        return
    
    # Mark attendance for Aldrin (Student ID 3 or 4)
    res = requests.post(
        f"{BASE_URL}/attendance/mark",
        headers={"Authorization": f"Bearer {faculty_token}"},
        json={
            "student_id": 3,
            "status": "Absent",
            "subject": "Microprocessors"
        }
    )
    if res.ok:
        print("Attendance marked and student notification triggered.")
    else:
        print(f"Failed to mark attendance: {res.text}")

def verify_student_notif():
    print("\n--- Verifying Student Notification ---")
    student_token = login("aldrin", "aldrin123")
    if not student_token:
        print("Failed to login as student.")
        return
    
    res = requests.get(
        f"{BASE_URL}/notifications/",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    if res.ok:
        notifs = res.json()
        print(f"Found {len(notifs)} notifications for student.")
        for n in notifs:
            print(f"- [{ 'X' if n['is_read'] else ' ' }] {n['title']}: {n['message']}")
            # Mark as read
            if not n['is_read']:
                requests.patch(f"{BASE_URL}/notifications/{n['id']}/read", headers={"Authorization": f"Bearer {student_token}"})
                print(f"  Marked notif {n['id']} as read.")
    else:
        print(f"Failed to fetch notifications: {res.text}")

if __name__ == "__main__":
    # Note: This requires the backend server and SQLite DB to be in a specific state.
    # We will assume 'aden' exists for admin and 'ajay' for faculty for this script.
    try:
        test_admin_assignment()
        test_faculty_attendance()
        verify_student_notif()
    except Exception as e:
        print(f"Error during verification: {e}")
