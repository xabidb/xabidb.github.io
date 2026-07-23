# Explorium StaffOpt V1 🚀
> **AI/ML Visitor Footfall Forecasting Engine**

StaffOpt V1 is a decoupled web application designed to forecast visitor footfall using machine learning models (Random Forest, LightGBM, Moving Average) and will translate those predictions into optimal staff headcount schedules and shift rosters (under development).

---

## 🌟 Key Features

* 📊 **Multi-Model Forecasting**: Predicts hourly & daily visitor footfall using preprocessed time-series models with upper/lower confidence bounds.
* 📈 **Performance Evaluation Dashboards**: Interactive 24-hour and 72-hour validation windows displaying MAE, RMSE, R² scores, predicted vs actual curves, and feature importance rankings.
* 👥 **Dynamic Staffing Calculator**: Interactive staffing ratio slider ($1\text{ Staff} : N\text{ Visitors}$), department filters, and automated shift block recommendations (Morning & Afternoon blocks).
* 🔐 **JWT Authentication & RBAC**: Role-Based Access Control enforcing permission gates across **Admin**, **Manager**, and **Viewer** roles.
* 🐳 **Containerized & Production Ready**: Fully dockerized stack with Nginx reverse proxying and automated GitHub Actions CI/CD.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
