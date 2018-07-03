import os

localFolder = "C://Users//acruz37//Documents//Salento-Grapevine-Yellows-Dataset"
rawFolder = "C://Users//acruz37//Documents//Salento-Grapevine-Yellows-Dataset//raw//"
classes = ['Black_rot','Control','Esca','Grapevine_yellow','Leaf_blight','Other']

for class_ in classes:
	currentRawPath = os.path.join(rawFolder,class_)
	files = [f for f in os.listdir(currentRawPath) if os.path.isfile(os.path.join(currentRawPath, f))]