# LNG Field Inspection v4.0

## แก้ไขหลัก
- จดจำ Login, Site, หน้าเดิม และ Tag เดิมใน localStorage
- เมื่อ Android เปิดกล้องแล้ว Chrome ถูก reload จะไม่กลับหน้า Login
- หาก Android ปิดหน้าเว็บระหว่างใช้กล้อง รูปไฟล์นั้นอาจกู้คืนไม่ได้ แต่ระบบจะกลับมาที่ Tag เดิมเพื่อถ่ายใหม่
- เพิ่ม cache-busting ให้ CSS/JavaScript เพื่อให้ GitHub Pages และมือถือโหลดไฟล์ v4.0 จริง
- Valve: Tag ซ้าย + ปุ่มปัญหาส้มขวา, OPEN/CLOSE คนละครึ่ง
- พื้นหลัง Valve: OPEN เขียว, CLOSE แดง, ปัญหาส้ม
- Summary แสดงสถานะปัญหาของ Valve เป็นสีส้ม

## วิธีอัปเดต
คัดลอกไฟล์ทั้งหมดในโฟลเดอร์นี้ไปแทนไฟล์เดิมใน Repository จากนั้น Commit และ Push ผ่าน GitHub Desktop
