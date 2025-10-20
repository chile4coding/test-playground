import React, { useState } from "react";
import type { ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

interface RegisterFormData {
  firstname: string;
  lastname: string;
  middlename: string;
  emailaddress: string;
  phonenumber: string;
  role: number;
  password: string;
}

interface RegisterFormErrors {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  emailaddress?: string;
  phonenumber?: string;
  role?: string;
  password?: string;
  submit?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: "",
    lastname: "",
    middlename: "",
    emailaddress: "",
    phonenumber: "",
    role: 0,
    password: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles = [
    { value: 0, label: "User" },
    { value: 1, label: "Admin" },
    { value: 2, label: "Moderator" },
    { value: 3, label: "Guest" },
  ];

  const validateForm = () => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.emailaddress.trim()) {
      newErrors.emailaddress = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailaddress)) {
      newErrors.emailaddress = "Please enter a valid email address";
    }

    if (!formData.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phonenumber)) {
      newErrors.phonenumber = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // const response = await fetch("/api/Account/Register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (response.ok) {
      //   setSuccess(true);
      //   setFormData({
      //     firstname: "",
      //     lastname: "",
      //     middlename: "",
      //     emailaddress: "",
      //     phonenumber: "",
      //     role: 0,
      //     password: "",
      //   });
      //   setErrors({});
      // } else {
      //   const errorData = await response.json();
      //   setErrors({
      //     submit: errorData.message || "Registration failed. Please try again.",
      //   });
      // }

      navigate("/");
    } catch {
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br  from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-100">
            <UserCheck className="size-8 text-indigo-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="size-5 text-green-600" />
            <span className="text-green-800">
              Account created successfully!
            </span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="size-5 text-red-600" />
            <span className="text-red-800">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.lastname ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="middlename"
                value={formData.middlename}
                onChange={handleInputChange}
                className="w-full rounded-lg text-gray-700 border border-gray-300 py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="emailaddress"
                value={formData.emailaddress}
                onChange={handleInputChange}
                className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.emailaddress ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.emailaddress && (
              <p className="mt-1 text-sm text-red-600">{errors.emailaddress}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phonenumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phonenumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phonenumber}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full rounded-lg text-gray-700 border border-gray-300 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full rounded-lg text-gray-700 border py-3 pl-10 pr-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg text-gray-700 bg-indigo-600 px-4 py-3 font-medium  transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
