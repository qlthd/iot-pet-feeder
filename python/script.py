import paho.mqtt.client as mqtt #import the client1
import time
import datetime
import json
import socket
from threading import Thread
import datetime

def turn_turbine(nb):
	for i in range(0,int(nb)) :
		print("Tourne !")

def printTask():
    while True:
        currentDT = datetime.datetime.now()
        current = { "day": str(currentDT.day)+"/"+str(currentDT.month)+"/"+str(currentDT.year), "hour": str(currentDT.hour)+":"+str(currentDT.minute) }
        list=json.loads(read_feed_schedule())
        for item in list:
            if(item['hour'] == current['hour'] and item['day'] == current['day']):
                turn_turbine(item['portions'])
        time.sleep(60)



def printTask2():
    while True:
        #print("2 !")
        time.sleep(2)


def on_connect(client, userdata, flags, rc):
     print("Connected flags"+str(flags)+"result code "\
     +str(rc)+"client1_id ")
     client.connected_flag=True

def on_publish(client,userdata,result):
    print("data published \n")

def write_feed_schedule(line):
    file = open("schedules.txt", "a+")
    file.write(line+"\r\n")

def write_log_sensor():
    f = open("sensor_log.txt","a+")
    d = datetime.datetime.today()
    f.write(str(d)+"\n")
    f.close()

def read_feed_schedule():
    fileHandler = open ("schedules.txt", "r")
    list = []
    i=0
    while True:
        line = fileHandler.readline()
        if not line :
            break
        day,hour,portion=line.split()
        list.append({ "id": i, "day" : day,"hour" : hour,"portions" : portion })
        i= i+1
    return json.dumps(list)

def read_sensor_log():
    fileHandler = open ("sensor_log.txt", "r")
    list = []
    i=0
    while True:
        line = fileHandler.readline()
        if not line :
            break
        date,hour=line.split()
        list.append({ "id": i, "date" : date,"hour" : hour})
        i= i+1
    return json.dumps(list)


def delete_schedule(i):
    with open("schedules.txt", "r") as infile:
        lines = infile.readlines()

    with open("schedules.txt", "w") as outfile:
        for pos, line in enumerate(lines):
            if pos != i:
                outfile.write(line)


############
def on_message(client, userdata, message):
    print("message received " ,str(message.payload.decode("utf-8")))
    print("message topic=",message.topic)
    if (message.topic == "feed"):
        turn_turbine(str(message.payload.decode("utf-8")))
    elif (message.topic == "schedules/add"):
        write_feed_schedule(str(message.payload.decode("utf-8")))
    elif (message.topic == "schedules/get"):
        list = read_feed_schedule()
        client.publish("schedules/send",list)
    elif (message.topic == "schedules/delete"):
        i = str(message.payload.decode("utf-8"))
        delete_schedule(int(i))
    elif (message.topic == "sensor/get"):
        list = read_sensor_log()
        client.publish("sensor/send",list)
########################################




def main():
    Thread(target = printTask).start()
    Thread(target = printTask2).start()

    broker_address=socket.gethostbyname('localhost')
    global client
    client = mqtt.Client("rasp") #create new instance
    client.on_connect = on_connect
    client.connect(broker_address) #connect to broker
    client.on_message=on_message
    client.on_publish=on_publish
    client.subscribe("feed")
    client.subscribe("schedules/add")
    client.subscribe("schedules/get")
    client.subscribe("schedules/delete")
    client.subscribe("sensor/get")
    client.loop_forever()

if __name__ == "__main__":
    main()

