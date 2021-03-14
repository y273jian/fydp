#!/bin/bash


# declare -a arr=("--log 01_04_2021_19_53_55.txt --image 01_04_2021_19_53_55.jpg" 
#                 "--log 01_06_2021_11_00_12.txt"
#                 "--log 01_07_2021_15_53_22.txt --image 01_07_2021_15_53_22.jpg" 
#                 "--log 01_12_2021_09_27_42.txt --image 01_12_2021_09_27_42.jpg"
#                 "--log 01_21_2021_02_06_31.txt --image 01_21_2021_02_06_31.jpg"
#                 )

for i in "${arr[@]}"
do
    echo "$i"
    python3 send_from_OD.py $i
done