import paho.mqtt.client as mqtt #import the client1
import time

def turn_turbine(nb):
	for i in range(1,int(nb)) :
		print("Tourne !")


############
def on_message(client, userdata, message):
    print("message received " ,str(message.payload.decode("utf-8")))
    print("message topic=",message.topic)
    turn_turbine(str(message.payload.decode("utf-8")))
########################################



broker_address="192.168.8.108" 
client = mqtt.Client("P1") #create new instance
client.connect(broker_address) #connect to broker
client.loop_start()
client.on_message=on_message
client.subscribe("nbPortions")
time.sleep(20)
client.loop_stop()



