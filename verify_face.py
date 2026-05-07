import face_recognition
import sys

# known_image_path = sys.argv[1]
# unknown_image_path = sys.argv[2]

# try:
#     known_image = face_recognition.load_image_file(known_image_path)
#     unknown_image = face_recognition.load_image_file(unknown_image_path)

#     known_encodings = face_recognition.face_encodings(known_image)
#     unknown_encodings = face_recognition.face_encodings(unknown_image)

#     if len(known_encodings) == 0 or len(unknown_encodings) == 0:
#         print("NO_FACE")
#         sys.exit()

#     result = face_recognition.compare_faces(
#         [known_encodings[0]],
#         unknown_encodings[0],
#         tolerance=0.5
#     )

#     if result[0]:
#         print("MATCH")
#     else:
#         print("NO_MATCH")

# except Exception as e:
#     print("ERROR")


import face_recognition
import sys

known_image_path = sys.argv[1]
unknown_image_path = sys.argv[2]

try:
    known_image = face_recognition.load_image_file(known_image_path)
    unknown_image = face_recognition.load_image_file(unknown_image_path)

    known_encodings = face_recognition.face_encodings(known_image)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    if len(known_encodings) == 0 or len(unknown_encodings) == 0:
        print("NO_FACE")
        sys.exit()

    # 👉 Calculate distance (better than compare_faces)
    distance = face_recognition.face_distance(
        [known_encodings[0]],
        unknown_encodings[0]
    )[0]

    print(distance)  # send score to Node

    # ✅ RELAXED threshold
    if distance < 0.65:
        print("MATCH")
    else:
        print("NO_MATCH")

except Exception as e:
    print("ERROR")