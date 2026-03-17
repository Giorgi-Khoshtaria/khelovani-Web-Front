"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import "./UserRegistrationVerify.scss";

type Stage = "loading" | "success" | "already" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [stage, setStage] = useState<Stage>(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? "" : "ტოკენი არ მოიძებნა. ლინკი არასწორია.",
  );

  const hasFired = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasFired.current) return;
    hasFired.current = true;

    const verify = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify-user-registration?token=${token}`,
        );

        const { status } = response.data;
        setStage(status === "already_verified" ? "already" : "success");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setErrorMessage(
            err.response?.data?.message ?? "დადასტურება ვერ მოხერხდა",
          );
        } else {
          setErrorMessage("სერვერთან დაკავშირება ვერ მოხერხდა");
        }
        setStage("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="ev-page">
      <div className="ev-card">
        {stage === "loading" && (
          <div className="ev-loader">
            <div className="ev-spinner">
              <span />
              <span />
              <span />
            </div>
            <p className="ev-loader__text">მიმდინარეობს დადასტურება...</p>
          </div>
        )}

        {(stage === "success" || stage === "already") && (
          <div className="ev-success">
            <div className="ev-checkmark">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="ev-checkmark__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="ev-checkmark__check"
                  fill="none"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>
            <h1 className="ev-title">
              {stage === "already" ? "უკვე დადასტურებულია" : "დადასტურებულია!"}
            </h1>
            <p className="ev-subtitle">
              {stage === "already"
                ? "შენი ელ-ფოსტა უკვე დადასტურებულია. შეგიძლია შეხვიდე სისტემაში."
                : "შენი ელ-ფოსტა წარმატებით დადასტურდა. ახლა შეგიძლია შეხვიდე სისტემაში."}
            </p>
            <Link href="/login" className="ev-btn ev-btn--success">
              შესვლა
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}

        {stage === "error" && (
          <div className="ev-error">
            <div className="ev-error__icon">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="ev-error__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="ev-error__cross"
                  fill="none"
                  d="M16 16l20 20M36 16l-20 20"
                />
              </svg>
            </div>
            <h1 className="ev-title">დადასტურება ვერ მოხერხდა</h1>
            <p className="ev-subtitle ev-subtitle--error">{errorMessage}</p>
            <Link href="/register" className="ev-btn ev-btn--error">
              ხელახლა რეგისტრაცია
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
      <div className="ev-blob ev-blob--1" />
      <div className="ev-blob ev-blob--2" />
    </div>
  );
}

export default function UserRegistrationVerify() {
  return (
    <Suspense fallback={<div className="ev-page"><div className="ev-card"><div className="ev-loader"><p className="ev-loader__text">იტვირთება...</p></div></div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
