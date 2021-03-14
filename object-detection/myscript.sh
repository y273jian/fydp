#!/usr/bin/bash
python3 yolov3/detect.py --source yolov3/data/samples/deer_img_test --weights yolov3/weights/last_deer140.pt --conf-thres 0.25 --save-txt
python3 output_script.py
rm -r output/*.txt
zip -r output.zip output
