"use client";

import { useUserLoginMutation } from "@/redux/api/authApi";
import { getUserInfo, storeUserInfo } from "@/services/auth.service";
import { Button, Col, Row, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import Form from "../Forms/Form";
import FormInput from "../Forms/FormInput";
import HomeImage from "@/assets/backgroundImg.jpg";
import Link from "next/link";
import loginImage from "../../assets/login-image.png";
import NavbarHome from "../NavbarHome/NavbarHome";

type FormValues = {
  id: string;
  password: string;
};

const LoginPage = () => {
  const [userLogin] = useUserLoginMutation();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    const key = "loadingKey";
    message.loading({ content: "Loading...", key });
    try {
      const res = await userLogin({ ...data }).unwrap();
      if (res?.accessToken) {
        storeUserInfo({ accessToken: res?.accessToken });
        const { role } = getUserInfo() as any;
        router.push(`/${role}/profile/account-profile`);
        message.success("User logged in successfully!");
        message.destroy(key);
      }
    } catch (err: any) {
      message.error(err.data.message||"User logged in fail");
      message.destroy(key);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${HomeImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div className="fixed top-0 left-0 w-full z-10">
        <NavbarHome></NavbarHome>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // dark fade
          zIndex: 1,
        }}
      ></div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            padding: "40px 30px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ marginBottom: "25px", textAlign: "center" }}>
            Login to Your Account
          </h1>
          <Form submitHandler={onSubmit} formKey="loginUser">
            <div style={{ marginBottom: "20px" }}>
              <FormInput
                name="email"
                type="email"
                size="large"
                label="User Email"
              />
            </div>
            <div style={{ marginBottom: "30px" }}>
              <FormInput
                name="password"
                type="password"
                size="large"
                label="User Password"
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", padding: "10px 0" }}
            >
              Login
            </Button>
          </Form>

          {/* Optional Sign-up prompt */}
          {/* 
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>Don't have an account?</p>
        <Link href="/signupUser">
          <p style={{ color: "#1890ff", cursor: "pointer" }}>Create Account</p>
        </Link>
      </div> 
      */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
