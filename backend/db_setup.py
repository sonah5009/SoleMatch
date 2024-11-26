import json
import sqlite3

def create_database():
    connection = sqlite3.connect('backend/user_data.db')
    cursor = connection.cursor()
    
    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL,
            pressureId INTEGER,
            pressureValid BOOLEAN,
            leftFootSize REAL,
            rightFootSize REAL,
            leftWidth REAL,
            rightWidth REAL
        );
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class TEXT,
            name TEXT,
            availableSize TEXT, -- List stored as a JSON string
            site TEXT
        );
    ''')

    data = [
        # Narrow
        ("narrow", "젤 버스트 28", [235, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295], "https://www.asics.co.kr/p/AKR_112432501-100"),
        ("narrow", "WINJOB CP112 유니섹스 와이드", [240, 250, 255, 260, 265, 270, 275, 280, 290], "https://www.asics.co.kr/p/AKR_112434802-200"),
        ("narrow", "넷버너 발리스틱 FF MT 3", [235, 240, 245, 250, 255, 260, 265, 270, 280, 285, 290], "https://www.asics.co.kr/p/AKR_112433004-103"),
        ("narrow", "리브레 CF", [235, 240, 245, 250, 255, 260, 265, 270, 275], "https://www.asics.co.kr/p/AKR_112433202-101"),
        ("narrow", "스웨이드 XL 더 네버원 IV", [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290], "https://www.ssg.com/item/itemView.ssg?itemId=1000621100052&siteNo=6009&salestrNo=1009&itemSsgCollectYn=N"),
        ("narrow", "나노 X4 - 블랙:브라운", [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000004497"),
        ("narrow", "워크아웃 플러스 빈티지 - 크림", [225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002673"),
        ("narrow", "BB 4000 II - 오프 화이트", [225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002682"),
        ("narrow", "플로트라이드 에너지 X", [235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002616"),
        ("narrow", "클럽 C 85 빈티지", [225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002672"),
        ("narrow", "클럽 C 그라운드 UK", [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002663"),
        ("narrow", "클럽 C 미드 II 리벤지 빈티지", [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002652"),
        ("narrow", "플로트라이드 에너지 5 (W)", [220, 225, 230, 235, 240, 245, 250], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002620"),
        ("narrow", "클래식레더 X SNEEZE", [250, 255, 260, 265, 270, 275, 280, 285, 290], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002117"),
        ("narrow", "클럽 C 그라운드 UK", [225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000003021"),
        ("narrow", "Reebok X ANINE BING 프리스타일 하이", [225, 230, 235, 240, 245, 250], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000003010"),
        ("narrow", "ATR MID", [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000003007"),
        ("narrow", "클럽 C 85 스웨이드", [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002958"),
        ("narrow", "BB 4000 II", [225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000002112"),
        ("narrow", "로얄 테크티", [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310], "https://www.reebok.co.kr/goods/goods_view.php?goodsNo=1000001374"),
        
        # Medium
        ("medium", "맥스쿠셔닝 프리미어 2.0", [250, 255, 260, 265, 270, 275, 280, 290, 300, 310, 320], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6150&adv=&cate=0001_0052_0007_&filter_wide=2"),
        ("medium", "고워크 아치핏 아웃도어", [250, 255, 260, 265, 260, 265, 270, 275, 280, 290, 300, 310, 320], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6305&adv=&cate=0001_0052_0007_&filter_wide=1"),
        ("medium", "크레스톤", [250, 260, 270, 280, 290], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6303&adv=&cate=0001_0052_0007_&filter_wide=1"),
        ("medium", "슬레이드 (슬립인스)", [250, 255, 260, 265, 270, 275, 280, 290], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6289&adv=&cate=0001_0052_0007_&filter_wide=1"),
        ("medium", "레이저 골드 TF", [250, 255, 260, 265, 270, 275, 280, 285, 290, 300], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6214&adv=&cate=0001_0052_0007_&filter_wide=1"),
        ("medium", "SKX 넥서스", [250, 255, 260, 265, 270, 275, 280, 285, 290, 300, 310, 320], "https://www.skecherskorea.co.kr/sub_product/view.php?idx=6084&adv=&cate=0001_0052_0007_&filter_wide=1")
        
    ]

    for entry in data:
        cursor.execute('''
            INSERT INTO shoes (class, name, availableSize, site) VALUES (?, ?, ?, ?)
        ''', (entry[0], entry[1], json.dumps(entry[2]), entry[3]))

    connection.commit()
    connection.close()

if __name__ == '__main__':
    create_database()
    print("Database and table created successfully.")
