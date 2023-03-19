from fastapi import HTTPException, status


class TaskException:
    @staticmethod
    def raise404(task_id: int):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id}: Not Found",
        )
