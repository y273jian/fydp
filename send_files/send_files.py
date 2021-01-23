'''
send files to server
'''
import requests

#  SETTINGS

BASE_DIR = '/mnt/d/study/fydp/'
# r = requests.post('http://localhost:8000/api/token/obtain/', \
#     json={'username':'alice','password':'test'})
# print (r.text)

def generage_payload(filename, idx):
    extension = filename.split('.')[-1]
    if extension == 'txt':
        content_type = 'text/plain'
    if extension == 'jpg' or extension == 'jpeg':
        content_type = 'image/jpeg'

    file = ('files_uploaded', (filename, open(BASE_DIR + filename, 'rb'),\
        content_type, {'idx': idx}))
    return file

def send_files(filenames):

    files_uploaded = []
    for idx, filename in enumerate(filenames):
        log = generage_payload(filename['log'], idx)
        image = generage_payload(filename['image'], idx)
        files_uploaded.append(log)
        files_uploaded.append(image)

    post_files = requests.post('http://localhost:8000/api/upload/', files=files_uploaded)
    print (post_files.text)

if __name__ == '__main__':
    files = [
        {
            'log': '01_04_2021_22_14_37.txt',
            'image': 'deer01.jpg'
        },
        {
            'log': '01_04_2021_22_14_37 (1).txt',
            'image': 'deer02.jpg'
        }
    ]
    send_files(files)
