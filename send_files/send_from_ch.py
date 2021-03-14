'''
send files to server
'''
import sys, getopt
import requests

#  SETTINGS

BASE_DIR = 'central_hub/'
# r = requests.post('http://localhost:8000/api/token/obtain/', \
#     json={'username':'alice','password':'test'})
# print (r.text)

def generage_content_type(filename):
    extension = filename.split('.')[-1]
    if extension == 'txt':
        content_type = 'text/plain'
    if extension == 'png':
        content_type = 'image/png'
    if extension == 'jpeg' or extension == 'jpg':
        content_type = 'image/jpg'
    
    return content_type

def send_files(filenames):
    files = {}

    log_content_type = generage_content_type(filenames['log'])
    log = (filenames['log'], open(BASE_DIR + filenames['log'], 'rb'),\
            log_content_type)
    files['log'] = log
    if 'image' in filenames.keys():
        image_content_type = generage_content_type(filenames['image'])
        image = (filenames['image'], open(BASE_DIR + filenames['image'], 'rb'),\
            image_content_type)
        files['image'] =image
    post_files = requests.post('http://localhost:8000/api/server/upload_from_ch/', files=files)
    print (post_files.text)

def main(argv):
    files = {}
    print(str(argv))
    try:
        opts, _ = getopt.getopt(argv, "hl:i:", ["log=", "image="])
    except getopt.GetoptError:
        print('send_files.py -l <log_filename> -i <image_filename>')
        return sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print('send_files.py -l <log_filename> -i <image_filename>')
            sys.exit()
        elif opt in ('-l', '--log'):
            files['log'] = arg
        elif opt in ('-i', '--image'):
            files['image'] = arg

    send_files(files)

if __name__ == '__main__':

    if len(sys.argv) < 2:
        print('File names missing.')
        sys.exit(2)
    
    main(sys.argv[1:])
