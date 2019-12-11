import datetime
import paho.mqtt.client as mqtt
import time

file = open("schedules.txt", "r")
lines = []
for line in file:
  if(line !='\n'):
    lines.append(line) #.split(' ')
print(lines)

def on_publish(client,userdata,result):
    print("data published \n")
    pass


Connected = False

broker="localhost"
port=1883
client = mqtt.Client()
client.on_publish = on_publish
client.connect("localhost",port,60)
client.publish('schedules',"5")




