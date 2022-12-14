import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import EditModal from "../../components/modal/EditModal";
import Pagination from "../../components/Pagination";
import Brand from "./brand";
import Products from "./products";

const Admin = () => {
	const router = useRouter();
	useEffect(() => {
		if (!localStorage.getItem("jwt")) {
			router.push("admin/auth");
		}
	}, []);
	const collectionTypes = ["products", "brand"];
	const [type, setType] = useState<string>(collectionTypes[0]);
	const handleLogout = () => {
		localStorage.removeItem("jwt");
		router.push("/admin/auth");
	};
	return (
		<div>
			<div>
				<div className="py-4 px-2 bg-blue-500 flex justify-between">
					<h1 className="text-4xl text-white ">CMS</h1>
					<button
						className="rounded-full px-3 text-white bg-red-500 cursor-pointer"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
				<div className="flex">
					<div className="w-1/5 h-full px-2 border-r-2 border-blue-900">
						<h2 className="text-3xl text-blue-500 py-4">Collection types</h2>
						{collectionTypes.map((collectionType, index) => (
							<div
								className={`py-2 px-1 rounded-md cursor-pointer hover:bg-slate-100 ${
									type === collectionType
										? `font-bold text-blue-400 bg-slate-200`
										: ``
								}`}
								key={index}
								onClick={() => setType(collectionType)}
							>
								{collectionType}
							</div>
						))}
					</div>
					{type === "products" ? <Products /> : <Brand />}
				</div>
			</div>
		</div>
	);
};

export default Admin;
