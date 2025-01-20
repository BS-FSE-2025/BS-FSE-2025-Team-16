from selenium import webdriver
from selenium.webdriver.common.by import By

# הגדרת הדפדפן
driver = webdriver.Chrome()

# פתיחת האתר
driver.get("http://localhost:3000")  # אתר React שלך

# בדיקת ה-state הראשוני
state = driver.execute_script("return window.getState();")
assert state["show"] == False
print("State לפני לחיצה:", state)

# חיפוש רכיב ולחיצה
button = driver.find_element(By.ID, "login-button")
button.click()

# בדיקת ה-state לאחר לחיצה
state = driver.execute_script("return window.getState();")
assert state["show"] == True
print("State אחרי לחיצה:", state)

# סגירת הדפדפן
driver.quit()
