import network
import time
from machine import ADC, I2C, Pin, Timer
import ssd1306
from font import draw_text
import requests

temp = ADC(4)
i2c1 = I2C(1, sda=Pin(18), scl=Pin(19))
oled = ssd1306.SSD1306_I2C(128, 64, i2c1)

green_led = Pin(16, Pin.OUT)
red_led = Pin(17, Pin.OUT)

green_led.on()
red_led.on()

def read_temp():
    adc_val = temp.read_u16()
    voltage = adc_val * (3.3 / 65535.0)
    celsius = 27 - (voltage - 0.706) / 0.001721
    return celsius

draw_text(oled, "Connecting to Wi-Fi", 0, 0)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("SSID", "PASSWORD")

while not wlan.isconnected():
    continue

green_led.off()
red_led.off()

oled.fill(0)

print(wlan.ifconfig())

def send_temp(timer):
    if not wlan.isconnected():
        return
    
    url = "http://192.168.100.18:4000/records"
    obj = { 'temperature': read_temp(), 'uploaded_by': 1}
    res = requests.post(url, json=obj)
    
    if res.status_code not in range(200, 299):
        red_led.on()
    else:
        green_led.on()
        red_led.off()
        time.sleep(2)
        green_led.off()
        
    res.close()
    
tim = Timer()
tim.init(mode=Timer.PERIODIC, period=60000, callback=send_temp)

while True:
    draw_text(oled, "Temp: {:.2f} C".format(round(read_temp(), 2)), 0, 0)
    oled.show()
    time.sleep(1)
    oled.fill(0)
