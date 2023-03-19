from fastapi import HTTPException, status


class CustomException:
    @staticmethod
    def raise401(detail: str):
        # Raise401 UnAuthorized
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
        )

    @staticmethod
    def raise404(detail: str):
        # Raise404 Not Found
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
        )
