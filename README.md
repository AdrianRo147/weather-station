# IoT Weather Station

A complete **IoT Weather Station** project that monitors temperature using the **Raspberry Pi Pico W’s** internal temperature sensor and displays the readings on an **SSD1306 OLED** screen.  
The device sends data to a backend API built with **Express.js**, which is then displayed in a **React + Vite + TanStack** web dashboard.

## Project Structure

```
weather-station/
├── firmware/ # MicroPython code for Pico W
├── backend/ # Express.js API server
├── frontend/ # React + Vite + TanStack website
├── LICENSE.md
└── README.md
```

## Hardware Setup

### Components
- **Raspberry Pi Pico W**
- **SSD1306 0.96" OLED Display (I2C)**
- - **Two LEDs (One red, One green)**
- Jumper wires and breadboard

### Wiring Diagram

| SSD1306 Pin  | Pico W Pin  | Function   |
|--------------|-------------|------------|
| VCC          | 3V3 (36)    | Power      |
| GND          | GND (23)    | Ground     |
| SCL          | GP19        | I2C Clock  |
| SDA          | GP18        | I2C Data   |

**I2C Address:** `0x3C`

| LED Color  | Pico W Pin  |
|------------|-------------|
| GREEN      | GP16        |
| RED        | GP17        |

## Firmware (MicroPython)

### Requirements
- [Thonny IDE](https://thonny.org/)
- MicroPython firmware installed on the Pico W

### Features
- Reads internal temperature using the Pico W’s onboard sensor
- Displays temperature on SSD1306 OLED
- Signalize successful / failed HTTP transfer using LEDs
- Sends temperature data to backend via Wi-Fi and HTTP

### Example Directory

```
firmware/
├── main.py
├── ssd1306.py
└── font.py
```


## Usage

### Firmware

    Flash MicroPython onto the Pico W.

    Open Thonny and connect to the Pico W.

    Upload all files in firmware/ to the device.

    Run main.py — the display should show the temperature, and readings will be sent to the backend.

### Backend (Express.js)

#### Setup

```
cd backend
npm install
Configure .env (See .env.example for reference)
npm run dev
```

Backend should start at `http://localhost:4000`

### Frontend (React + Vite + TanStack)

#### Setup

```
cd frontend
npm install
Configure .env (See .env.example for reference)
npm run dev
```

Frontend should start at `http://localhost:3000`
