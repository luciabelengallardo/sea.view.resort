import Modal from '../ui/Modal';

export default function VideoModal({ open, onClose, videoUrl }) {
    return (
        <Modal open={open} onClose={onClose} size="lg" overlayClassName="backdrop-blur-sm bg-black/70" lockScroll trapFocus>
            <div className="w-full mx-4 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        title="resort-video"
                        src={videoUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                </div>
            </div>
        </Modal>
    );
}


