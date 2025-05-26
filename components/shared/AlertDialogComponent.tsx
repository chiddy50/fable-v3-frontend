"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogComponentProps {
	// Content props
	title?: string;
	description?: string;
	
	// Button text props
	triggerText?: string;
	cancelText?: string;
	actionText?: string;
	
	// Event handlers
	onCancel?: () => void;
	onAction?: () => void;
	
	// Button variants and styling
	triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	actionVariant?: "default" | "destructive";
	
	// Control props
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	
	// Optional trigger element (if you want custom trigger)
	trigger?: React.ReactNode;
}

export function AlertDialogComponent({
	title = "Are you absolutely sure?",
	description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
	triggerText = "Show Dialog",
	cancelText = "Cancel",
	actionText = "Continue",
	onCancel,
	onAction,
	triggerVariant = "outline",
	actionVariant = "default",
	open,
	onOpenChange,
	trigger
}: AlertDialogComponentProps) {
	const handleCancel = () => {
		onCancel?.();
	};

	const handleAction = () => {
		onAction?.();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			{/* <AlertDialogTrigger asChild>
				{trigger || (
					<Button variant={triggerVariant}>
						{triggerText}
					</Button>
				)}
			</AlertDialogTrigger> */}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleCancel}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction 
						onClick={handleAction}
						className={actionVariant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
					>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}





{/* <AlertDialogComponent
	title="Delete Post"
	description="Are you sure you want to delete this post? This action cannot be undone."
	triggerText="Delete"
	cancelText="Keep Post"
	actionText="Delete Post"
	triggerVariant="destructive"
	actionVariant="destructive"
	onCancel={() => console.log('Post deletion cancelled')}
	onAction={() => handleDeletePost()}
/> */}


{/* <AlertDialogComponent
	onCancel={() => console.log('Cancelled')}
	onAction={() => console.log('Confirmed')}
/> */}




// const [dialogOpen, setDialogOpen] = useState(false);

// <AlertDialogComponent
// 	open={dialogOpen}
// 	onOpenChange={setDialogOpen}
// 	title="Save Changes"
// 	description="Do you want to save your changes before leaving?"
// 	actionText="Save & Exit"
// 	onCancel={() => {
// 		setDialogOpen(false);
// 		// Handle cancel logic
// 	}}
// 	onAction={() => {
// 		setDialogOpen(false);
// 		handleSaveAndExit();
// 	}}
// />










// // Confirmation dialog
// <AlertDialogComponent
// 	title="Confirm Action"
// 	description="Are you sure you want to proceed?"
// 	actionText="Yes, Continue"
// 	onAction={() => handleConfirm()}
// />

// // Destructive action
// <AlertDialogComponent
// 	title="Delete Account"
// 	description="This will permanently delete your account and all associated data."
// 	triggerText="Delete Account"
// 	actionText="Delete Forever"
// 	triggerVariant="destructive"
// 	actionVariant="destructive"
// 	onAction={() => handleDeleteAccount()}
// />

// // Save prompt
// <AlertDialogComponent
// 	title="Unsaved Changes"
// 	description="You have unsaved changes. What would you like to do?"
// 	cancelText="Discard"
// 	actionText="Save Changes"
// 	onCancel={() => handleDiscard()}
// 	onAction={() => handleSave()}
// />