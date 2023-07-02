import Modal from "react-modal";
import Avatar from "../assets/avatar.jpg";
import axios from "axios";

export default function JobApplicationModal (props) {

    const { isOpen, handleCloseModal, contentLabel, item } = props;

    const handleDownload = async () => {
        const response = await axios.get(`http://localhost:3001/download/${item?._id}`, { responseType: 'blob' });
        if (response) {
            console.log(response);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'document.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            contentLabel={contentLabel}    
        >
            <div className="modal-content">
                <div className="modal-content-header">
                    <img src={Avatar} alt="avatar" style={{width: "100px", height: "100px", borderRadius: "50%" }}/>
                    <div className="modal-block">
                        <div className="modal-fullname">{item?._source?.name} {item?._source?.surname}</div> 
                        <div className="modal-education">{item?._source?.education}</div>
                        <div className="modal-address">{item?._source?.address}</div>
                    </div>
                    <button className="download-button" onClick={handleDownload}>Download CV</button>
                    <button className="download-button">Download Cover Letter</button>
                </div>
                <div className="modal-body-section">
                    <div className="cv-section">
                        <div className="modal-section-header">CV</div>
                        <div className="modal-section-text">{item?._source?.cvContent}</div>
                    </div>
                    <div className="cl-section">
                        <div className="modal-section-header">Cover letter</div>
                        <div className="modal-section-text">{item?._source?.coverLetterContent}</div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}