
import { createPortal } from "react-dom";

export interface ConfirmDeleteModalProps {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this student?</p>

        <div className="modal-actions">
          <button
            className="btn-cancel me-3"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm "
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
