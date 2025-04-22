"use client";

import { useState } from "react";
import { loginUserWithEmailAndPassword } from "@/supabase/auth";
import { changeEmail, resetPassword } from "@/supabase/user";

function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function login(formData) {
		setLoading(true);
		setError("");
		setSuccess("");

		const email = formData.get("email");
		const password = formData.get("password");

		if (!email || !password) {
			setError("Please fill in both fields.");
			setLoading(false);
			return;
		}

		loginUserWithEmailAndPassword(email, password)
			.then(() => {
				setSuccess("Login successful! Redirecting...");
				setError(null);
			})
			.catch((err) => {
				setError(err.message || "Login failed. Please try again.");
			})
			.finally(() => setLoading(false));
	}

	return (
		<div className="flex flex-col items-center space-y-8 pt-[80px] grow">
			<img src="/logo.png" className="w-[150px]" />
			<form className="flex flex-col items-center space-y-6" action={login}>
				<div className="flex flex-col space-y-2 w-[300px]">
					<label className="input input-bordered bg-white flex items-center gap-2 shadow-sm">
						<input
							name="email"
							type="email"
							className="grow text-sm text-neutral-700 selection:bg-neutral-200"
							placeholder="Email"
						/>
					</label>
					<label className="input input-bordered bg-white flex items-center gap-2 shadow-sm">
						<input
							name="password"
							type="password"
							placeholder="Password"
							className="grow text-sm text-neutral-700 selection:bg-neutral-200"
						/>
					</label>
				</div>
				{loading && <p className="text-blue-500 text-sm">trying login...</p>}
				{error && <p className="text-red-500 text-sm">{error}</p>}
				{success && <p className="text-green-500 text-sm">{success}</p>}
				<button
					className={`btn btn-sm shadow-sm px-8 h-[40px] rounded-full text-white ${
						loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-300"
					}`}
					type="submit"
					disabled={loading}
				>
					{loading ? "Logging in..." : "Log In"}
				</button>
			</form>
		</div>
	);
}

export default LoginPage;