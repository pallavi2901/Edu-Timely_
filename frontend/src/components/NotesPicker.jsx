import React, { useState, useEffect } from 'react';
import './NotesPicker.css';
import pdfIcon from '@/assets/icons/pdf.png';
import imageIcon from '@/assets/icons/image.png';
import textIcon from '@/assets/icons/text.png';
import defaultIcon from '@/assets/icons/file.png';

const NotesPicker = () => {
  const [notes, setNotes] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameInputs, setRenameInputs] = useState({});

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  const handleUpload = async (event) => {
    event.preventDefault();
  
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const title = event.target.title.value;
  
    if (!file) {
      alert('Please select a file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
  
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      await fetchNotes(); // Refresh the notes list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRename = async (id) => {
    if (!renameInputs[id]?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameInputs[id] }),
      });

      if (!response.ok) {
        console.error('Rename failed:', await response.json());
      } else {
        setRenameId(null);
        setRenameInputs((prev) => ({ ...prev, [id]: '' }));
        fetchNotes();
      }
    } catch (error) {
      console.error('Error renaming note:', error);
    }
  };

  const handleContextMenu = (event, note) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.pageX, y: event.pageY, note });
  };
  

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const getFileIcon = (filename) => {
    if (!filename) return defaultIcon;
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return imageIcon;
    if (['pdf'].includes(ext)) return pdfIcon;
    if (['txt', 'doc', 'docx'].includes(ext)) return textIcon;
    return defaultIcon;
  };

  return (
    
<div className="notes-container" onClick={handleCloseContextMenu} onContextMenu={(e) => e.preventDefault()}>
<h1>Notes Picker</h1>
<button className="fab-button" onClick={(e) => {
  e.stopPropagation();
  setIsPickerOpen(prev => !prev);
}}>
  +
</button>


      <div className={`notes-form ${isPickerOpen ? 'open' : ''}`}>
        <h2>Notes Picker</h2>
        {/* <form>
          <input type="text" placeholder="Note Title" />
          <textarea placeholder="Note Content" />
          <input type="file" id="fileInput" />
          <label htmlFor="fileInput"></label>
          <center><button type="submit" className="upload-button">Upload</button></center>
        </form> */}
 <form onSubmit={handleUpload}>
 <input type="text" name="title" placeholder="Note Title" className="Title" required tabIndex="0" />

  {/* Hidden file input */}
  <input type="file" id="fileInput" required hidden />

  {/* Custom styled label acting as a button */}
  <label htmlFor="fileInput" className="custom-file-label">Select</label>

  <center><button type="submit" className="upload-button">Upload</button></center>
</form>


      </div>

      <div className="files-grid">
        {notes.map((note) => (
          <div key={note._id} className="file-card" onContextMenu={(e) => handleContextMenu(e, note)}>
            <img src={getFileIcon(note.fileUrl)} alt="File Icon" className="file-icon" />
            
            {renameId === note._id ? (
              <div className="rename-container">
                <input
                  type="text"
                  value={renameInputs[note._id] || ''}
                  onChange={(e) =>
                    setRenameInputs((prev) => ({ ...prev, [note._id]: e.target.value }))
                  }
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(note._id)}
                />
                <button onClick={() => handleRename(note._id)}>✔</button>
              </div>
            ) : (
              <h4>{note.title}</h4>
            )}
          </div>
        ))}
      </div>

      {contextMenu && (
        <ul className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <li>
            <a href={`http://localhost:5001${contextMenu.note.fileUrl}`} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          </li>
          <li onClick={() => handleDelete(contextMenu.note._id)}>Delete</li>
          <li onClick={() => { 
            setRenameId(contextMenu.note._id);
            setRenameInputs((prev) => ({ ...prev, [contextMenu.note._id]: contextMenu.note.title }));
            setContextMenu(null);
          }}>
            Rename
          </li>
        </ul>
      )}
    </div>
  );
};

export default NotesPicker;
