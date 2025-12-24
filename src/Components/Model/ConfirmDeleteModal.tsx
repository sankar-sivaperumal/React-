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
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="confirm-modal">
        <h3 id="confirm-title">Confirm Deletion</h3>
        <p id="confirm-desc">
          Are you sure you want to delete this student?
        </p>

        <div className="modal-actions">
          <button
            type="button"
            name="cancel-delete"
            className="btn-cancel me-3"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            name="confirm-delete"
            className="btn-confirm"
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
