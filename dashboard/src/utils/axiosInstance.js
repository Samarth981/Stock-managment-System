import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://marketpulse-rig8.onrender.com",
  withCredentials: true,
});

export const showErrorPopup = (message) => {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.backgroundColor = "#e74c3c";
  popup.style.color = "#fff";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.fontSize = "16px";
  popup.style.padding = "15px 25px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
  popup.style.zIndex = "1000";
  popup.style.maxWidth = "90%";
  popup.style.textAlign = "center";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease-in-out";

  popup.innerText = message;

  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  }, 2000);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    try {
      if (error.response) {
        const { status, data } = error.response;
        let errorMessage =
          data?.message || data?.error || "Something went wrong";

        switch (status) {
          case 400:
            if (data.details) {
              errorMessage =
                "Validation Error: " +
                data.details.map((err) => err.message).join(", ");
            } else if (data.error === "Invalid ID format.") {
              errorMessage = "Invalid ID format.";
            }
            break;

          case 401:
            if (!originalRequest._retry) {
              originalRequest._retry = true;

              try {
                const { data: tokenData } = await axios.post(
                  "https://marketpulse-rig8.onrender.com/refresh-token",
                  {},
                  { withCredentials: true }
                );

                localStorage.setItem("accessToken", tokenData.accessToken);
                axiosInstance.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${tokenData.accessToken}`;
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${tokenData.accessToken}`;

                return axiosInstance(originalRequest);
              } catch (refreshError) {
                showErrorPopup("Session expired. Please log in again.");
                return Promise.reject(refreshError);
              }
            }
            errorMessage =
              data?.message || "Authentication Error: Please log in again.";

            break;

          case 403:
            errorMessage = data?.message || "Access Denied";
            break;

          case 409:
            errorMessage = "Duplicate Key Error: " + data.message;
            break;

          default:
            break;
        }

        showErrorPopup(errorMessage);
      } else if (error.request) {
        showErrorPopup("No response from server. Please check your network.");
      } else {
        showErrorPopup("Something went wrong. Please try again.");
      }
    } catch (error) {
      showErrorPopup("An error occurred. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
