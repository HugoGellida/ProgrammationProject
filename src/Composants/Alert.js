import "./Alert.css";

export default function Alert({ message, buttonMessage, onClick }) {
    return (
        <div className="fill">
            <div className="Alert">
                <label className="simpleText" style={{ marginTop: 'auto', marginBottom: 'auto' }}>{message}</label>
                <button className="fail" style={{ marginTop: 'auto', marginBottom: 'auto' }} onClick={onClick}>{buttonMessage}</button>
            </div>
        </div>
    )
}