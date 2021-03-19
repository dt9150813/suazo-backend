from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import sys
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import json
print('# Python script started')
print(sys.argv[1])
lines = sys.stdin.readlines()
parsed = (sys.argv[1])
data = json.loads(lines[0])
print(data['businessName'])
print('# gettin packet')
packet = io.BytesIO()
print('# create a new PDF with Reportlab')
can = canvas.Canvas(packet, pagesize=letter)
# can.setFont(self, "Times-Roman", 11)
print('# start editing pdf')
can.drawString(195, 630, data['businessName'])  # Owner name as sys.argv[1]
can.drawString(195, 600, data['businessStreet'])  # Write address
can.drawString(381, 600, "Bryce Canyon City")  # Write city
can.drawString(500, 600, "UT")  # Write state
can.drawString(537, 600, "84120")  # Write zipcode
can.drawString(60, 563, "Registered Agent name")
can.drawString(140, 534, "Address of the agent")
can.drawString(45, 508, "Agent city")
can.drawString(510, 508, "84120")
can.drawString(138, 452, "Firstname and lastname of #1")
can.drawString(457, 452, "Position of #1")
can.drawString(138, 428, "The full street address of #1")
can.drawString(350, 428, "The city of #1")
can.drawString(500, 428, "#1")
can.drawString(537, 428, "84120")
can.drawString(138, 407, "Firstname and lastname of #2")
can.drawString(457, 407, "Position of #2")
can.drawString(138, 383, "The full street address of #2")
can.drawString(350, 383, "The city of #2")
can.drawString(500, 383, "#2")
can.drawString(537, 383, "84120")
can.drawString(138, 353, "Firstname and lastname of #3")
can.drawString(457, 353, "Position of #3")
can.drawString(138, 329, "The full street address of #3")
can.drawString(350, 329, "The city of #3")
can.drawString(500, 329, "#3")
can.drawString(537, 329, "84120")
can.drawString(138, 300, "Firstname and lastname of #4")
can.drawString(457, 300, "Position of #4")
can.drawString(138, 276, "The full street address of #4")
can.drawString(350, 276, "The city of #4")
can.drawString(500, 276, "#4")
can.drawString(537, 276, "84120")
can.drawString(140, 238, "X")
can.drawString(140, 218, "X")
can.drawString(314, 222, "Duration")
can.drawString(120, 200, "Optional purpose")
can.drawString(184.5, 145, "X")  # Female yes
can.drawString(255.5, 142, "X")  # Female no
can.drawString(184.5, 129, "X")  # Minority yes
can.drawString(255.5, 126, "X")  # Minority no
can.drawString(404, 130, "Specification")
print('# finish editing pdf')
can.save()
print('# canvas saved')
print('# move to the beginning of the StringIO buffer')
packet.seek(0)
new_pdf = PdfFileReader(packet)
print('# read your existing PDF')
existing_pdf = PdfFileReader(open("test.pdf", "rb"))
output = PdfFileWriter()
print('# add the "watermark" (which is the new pdf) on the existing page')
page = existing_pdf.getPage(0)
page.mergePage(new_pdf.getPage(0))
output.addPage(page)
print('# finally, write "output" to a real file')
outputStream = open(f"../tmp/{sys.argv[1]}_Certificate_of_Organization.pdf", "wb")
output.write(outputStream)
outputStream.close()
print('# script done')