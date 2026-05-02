import React from "react";
import { Button, Modal, ModalProps, message } from "antd";
import Form from "../Forms/Form";
import FormInput from "../Forms/FormInput";
import { useCreatePartsMutation } from "@/redux/api/serviceApi";

interface CreatePartModalProps extends ModalProps {
    partName?: string;
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    onCreatePart: (part: any) => void;
}

/**
 * CreatePartModal component is a modal form used for creating a new part.
 * It handles form submission, displays loading and success/error messages,
 * and invokes the provided callbacks for part creation and modal cancellation.
 *
 * @param {string} partName - The default name of the part to be created.
 * @param {boolean} isModalOpen - A flag indicating whether the modal is open or closed.
 * @param {() => void} handleCancel - A callback function to handle modal cancellation.
 * @param {(part: { partId: string; name: string; unit: number; unitPrice: number }) => void} onCreatePart - A callback function to handle the creation of a new part.
 * @param {CreatePartModalProps} props - Additional props passed to the Modal component.
 *
 * @returns {JSX.Element} The rendered CreatePartModal component.
 */
function CreatePartModal({
    partName,
    isModalOpen,
    handleCancel,
    onCreatePart,
    ...props
}: CreatePartModalProps) {
    const [createPart] = useCreatePartsMutation();
    const key = "createPartKey";

    const formDataHandler = async (data: any) => {
        message.loading({
            content: "Creating part...",
            key,
            duration: 0,
        });

        const newPart = {
            name: data.name || partName,
            unitPrice: Number.parseFloat(data.unitPrice),
            provider: data.provider,
            installationHours: Number.parseFloat(data.installationHours),
        };

        createPart(newPart).unwrap().then((response) => {
            message.success("Part created successfully");
            onCreatePart(response);
            handleCancel();
        }).catch((error) => {
            console.error("Part creation error:", error);
            message.error("Failed to create part");
        }).finally(() => {
            message.destroy(key);
        });
    };

    return (
        <Modal
            title="Part Creation Form"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[]}
            {...props}
        >
            <Form
                formKey="partCreate"
                className="flex flex-col gap-4"
                submitHandler={formDataHandler}
            >
                <FormInput
                    type="text"
                    label="Part Name"
                    name="name"
                    defaultValue={partName}
                    required
                />
                <FormInput type="number" label="Unit Price" name="unitPrice" required />
                <FormInput type="text" label="Provider" name="provider" required />
                <FormInput
                    type="number"
                    label="Installation Hours"
                    name="installationHours"
                    required
                />
                <Button htmlType="submit" key="submitPart" type="primary">
                    Create Part
                </Button>
            </Form>
        </Modal>
    );
}

export default CreatePartModal;
