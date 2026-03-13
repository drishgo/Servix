import io
from docx import Document
import pymupdf

def docxParser(file_bytes):
    # Wrap bytes in a file-like object so Document can read it
    doc = Document(io.BytesIO(file_bytes))
    full_text = [para.text for para in doc.paragraphs]
    return "\n".join(full_text)

def pdfParser(file_bytes):
    # Open PDF from memory (stream)
    doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    full_text = []
    for page in doc:
        full_text.append(page.get_text()) # Extracts text from the page
    return "\n".join(full_text)