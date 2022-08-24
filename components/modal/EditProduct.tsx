import React, {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import Image from "next/image";
import EditModal from "./EditModal";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { urlBuilder } from "../../utils/UrlBuilder";
import {
	CREATE,
	DELETE,
	DeleteProduct,
	UPLOAD,
} from "../../src/services/product";
import { FetchBrands } from "../../src/services/brand";

const URL = "http://localhost:1337";

interface Props {
	product: Product;
	isCreate: boolean;
	setOpenModal: Dispatch<SetStateAction<boolean>>;
}
const cache = new InMemoryCache();

const client = new ApolloClient({
	cache,
	link: createUploadLink({
		uri: `${URL}/graphql`,
	}),
});

interface initProductInput {
	model: string;
	size: number;
	brand: string;
	image: string;
}
const EditProduct = (props: Props) => {
	const { product, isCreate, setOpenModal } = props;
	const initProduct: initProductInput = {
		model: product.attributes.model,
		size: 0,
		brand: product.attributes.brand.data.id,
		image: product.attributes.image.data.id,
	};
	const [file, setFile] = useState<File>(null);
	const [brands, setBrands] = useState<Array<Brand>>([]);
	const [modifiedProduct, setModifiedProduct] = useState(initProduct);
	var sizes: Array<number> = [],
		i = 0,
		len = 40;
	while (++i <= len) sizes.push(i);

	useEffect(() => {
		FetchBrands().then((data) => setBrands(data.brands.data));
	}, []);

	const onImageChange = (event) => {
		console.log(event.target.files[0]);

		setFile(event.target.files[0]);
		console.log(file);
	};
	const onChangeInput = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setModifiedProduct({
			...modifiedProduct,
			[e.target.name]: e.currentTarget.value,
		});
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		client
			.mutate({
				mutation: UPLOAD,
				variables: {
					file: file,
				},
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.error(err);
			});

		// console.log({ ...modifiedProduct });

		// client
		// 	.mutate({
		// 		mutation: CREATE,
		// 		variables: {
		// 			...modifiedProduct,
		// 			size: parseFloat(modifiedProduct.size as unknown as string),
		// 		},
		// 	})
		// 	.then((res) => {
		// 		console.log(res);
		// 		setOpenModal(false);
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
	};
	const handleDeleteProduct = (id: string) => {
		client
			.mutate({
				mutation: DELETE,
				variables: {
					id: id,
				},
			})
			.then((res) => {
				setOpenModal(false);
			})
			.catch((err) => {
				alert(err);
			});
	};
	return (
		<EditModal setOpenModal={setOpenModal}>
			<form className="flex" onSubmit={onSubmit}>
				<Image
					width={300}
					height={300}
					src={urlBuilder(product.attributes.image.data.attributes.url)}
				/>
				<div className="px-4 py-6">
					<label htmlFor="model" className="text-white text-xs">
						Model:{" "}
					</label>
					<input
						className="w-full py-2 px-1 rounded-sm border-solid border-red-500"
						name="model"
						type="text"
						defaultValue={product.attributes.model}
						onChange={onChangeInput}
					/>
					<label htmlFor="size" className="text-white text-xs">
						Size:{" "}
					</label>
					<select
						name="size"
						id="size"
						className="w-full py-1"
						onChange={onChangeInput}
					>
						{sizes.map((size, index) => (
							<option value={size} key={index}>
								{size}
							</option>
						))}
					</select>
					<label className="text-white text-xs" htmlFor="brands">
						Brands
					</label>
					<select
						onChange={onChangeInput}
						className="w-full py-1"
						name="brand"
						id="brands"
						defaultValue={!isCreate ? product.attributes.brand.data.id : "1"}
					>
						{isCreate ? (
							<option disabled>Choose a brand</option>
						) : (
							<option>{product.attributes.brand.data.attributes.name}</option>
						)}
						{brands.map((brand, index) => (
							<option key={index} value={brand.id}>
								{brand.attributes.name}
							</option>
						))}
					</select>
					<input type="file" name="" id="" onChange={onImageChange} />
					<div className="flex justify-evenly my-5">
						<button
							type="button"
							className="px-4 py-1 text-white bg-red-500 rounded-lg outline-none disabled:bg-red-200"
							disabled={isCreate}
							onClick={() => handleDeleteProduct(product.id)}
						>
							Delete
						</button>
						<button
							type="submit"
							className="px-4 py-1 text-white bg-green-500 rounded-lg outline-none"
						>
							Save
						</button>
					</div>
				</div>
			</form>
		</EditModal>
	);
};

export default EditProduct;