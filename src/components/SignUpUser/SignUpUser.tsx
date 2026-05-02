"use client";

import { useSignUpUserMutation } from "@/redux/api/UserApi";
import { Button, Col, Row, message } from "antd";
import Form from "../Forms/Form";
import FormInput from "../Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupUserSchema } from "@/schemas/signup";
import Image from "next/image";
import loginImage from "../../assets/login-image.png";
import Link from "next/link";
import { useState } from "react";

const SignUpUser = () => {
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: any) => {
    const { confPassword, ...rest } = values;
    const payload = { ...rest, role: "admin" };
    const key = "loadingKey";

    message.loading({ content: "Registering...", key });

    try {
      await signUpUser(JSON.stringify(payload)).unwrap();
      message.success({ content: "Registration successful!", key });
      setErrorMessage(null);
    } catch (error) {
      message.error({ content: "Registration failed!", key });
      setErrorMessage("Please check your email and try again.");
    } finally {
      message.destroy(key);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
      }}
      className="gap-14"
    >
      {/* Left side image */}
      <Col sm={12} md={16} lg={10}>
        <Image
          src={loginImage}
          alt="signup image"
          layout="responsive"
          width={500}
          height={300}
          className="max-w-full h-auto"
        />
      </Col>

      {/* Right side form */}
      <Col sm={12} md={8} lg={8}>
        <h1 style={{ margin: "15px 0px" }}>Create your account</h1>
        <div>
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(signupUserSchema)}
            formKey="signupUser"
          >
            <FormInput
              name="name"
              type="text"
              size="large"
              label="Full Name"
              placeholder="John Doe"
              required
            />
            <FormInput
              name="email"
              type="email"
              size="large"
              label="Email"
              placeholder="john@example.com"
              required
            />
            <FormInput
              name="address"
              type="text"
              size="large"
              label="Address"
              placeholder="Uttara, Dhaka"
              required
            />
            <FormInput
              name="contactNum"
              type="text"
              size="large"
              label="Contact Number"
              placeholder="017..."
              required
            />
            <FormInput
              name="password"
              type="password"
              size="large"
              label="Password"
              required
            />
            <FormInput
              name="confPassword"
              type="password"
              size="large"
              label="Confirm Password"
              required
            />

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ marginTop: "10px" }}
            >
              Register
            </Button>
          </Form>

          {/* Already have an account */}
          <div style={{  textAlign: "center" }}>
            <p>Already have an account?</p>
            <Link href="/login">
              <p className="text-blue-500 hover:underline">Login here</p>
            </Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SignUpUser;
