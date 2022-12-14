import Image from "next/image";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import Modal from "./Modal";

interface Props {
	setOpenModal: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}
const EditModal = (props: Props) => {
	const { setOpenModal, children } = props;
	return (
		<Modal>
			<div className="bg-blue-500 relative ">
				<button
					className="absolute top-0 right-1 p-1 cursor-pointer"
					onClick={() => setOpenModal(false)}
				>
					X
				</button>
				<div className="">{children}</div>
			</div>
		</Modal>
	);
};

export default EditModal;
