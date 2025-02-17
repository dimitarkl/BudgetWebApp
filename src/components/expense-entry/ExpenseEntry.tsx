import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import ExpenseType from "./expense-type/ExpenseType";
import { useContext, useState } from "react";
import { createExpense, editExpense } from "@/api/expenses";
import UserContext from "../contexts/UserContext";
import { isError } from "@/lib/errorCheck";
import { Error } from "../error/Error";
import { Switch } from "../ui/switch";
import { Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
	//TODO add validation
	sum: z
		.string()
		.min(1, "Amount is required")
		.refine((val) => !isNaN(Number(val)), {
			message: "Please enter a valid  number",
		}),
	description: z.string().optional(),
	transactionType: z.enum(["expense", "income"]),
});
type Props = {
	expense?: {
		id: string;
		userId: string;
		createdAt: string;
		transactionType: "expense" | "income";
		sum: number;
		type: string;
		description?: string;
	};
	inputType: "Create" | "Edit";
};
export default function ExpenseEntry({ expense, inputType }: Props) {
	const [errorMessage, setErrorMessage] = useState("");
	const [type, setType] = useState("");
	const user = useContext(UserContext);
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sum: expense ? String(expense?.sum) : "",
			transactionType: expense ? expense.transactionType : "expense",
			description: expense ? expense?.description : "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		switch (inputType) {
			case "Create":
				if (type && user != false && user?.uid) {
					const response = await createExpense(
						user?.uid,
						data.sum,
						type,
						data.description
					);
					if (isError(response)) {
						setErrorMessage(response.message);
						return;
					} else {
						form.reset();
						navigate(0);
					}
				} else if (type) setErrorMessage("User Not Found");
				else if (user != false && user?.uid)
					setErrorMessage("Expense Type Not Selected");
				break;
			case "Edit":
				if (type && user != false && user?.uid && expense) {
					const response = await editExpense(
						expense.id,
						user?.uid,
						data.sum,
						type,
						data.description
					);
					if (isError(response)) {
						setErrorMessage(response.message);
						return;
					} else {
						form.reset();
						navigate(0);
					}
				} else if (type) setErrorMessage("User Not Found");
				else if (user != false && user?.uid)
					setErrorMessage("Expense Type Not Selected");
				break;
		}
	}
	const Type = (currentValue: string) => setType(currentValue);

	return (
		<>
			<DialogContent className="min-w-fit">
				<DialogHeader>
					<DialogTitle>Expense</DialogTitle>
					<DialogDescription>Input Expenses</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full max-w-md space-y-4"
					>
						<FormField
							control={form.control}
							name="transactionType"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Type
										</FormLabel>
										<FormDescription>
											Switch between expense and income
										</FormDescription>
									</div>
									<FormControl>
										<div className="flex items-center space-x-2">
											{field.value === "expense" ? (
												<Minus className="h-4 w-4 text-destructive" />
											) : (
												<Plus className="h-4 w-4 text-green-500" />
											)}
											<Switch
												checked={
													field.value === "income"
												}
												onCheckedChange={(checked) => {
													field.onChange(
														checked
															? "income"
															: "expense"
													);
													//Not updating on time so we take the opposite
													if (
														field.value ===
															"income" &&
														form.getValues("sum") &&
														Array.from(
															form.getValues(
																"sum"
															)
														)[0] !== "-"
													)
														form.setValue(
															"sum",
															"-" +
																form.getValues(
																	"sum"
																)
														);
													else if (
														form.getValues("sum") &&
														Array.from(
															form.getValues(
																"sum"
															)
														)[0] === "-"
													)
														form.setValue(
															"sum",
															form
																.getValues(
																	"sum"
																)
																.slice(1)
														);
												}}
											/>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="flex flex-row space-x-2">
							<FormField
								control={form.control}
								name="sum"
								render={({ field }) => (
									<FormItem className="flex-grow">
										<FormControl>
											<Input
												className="text-2xl"
												type="number"
												pattern="-?[0-9]+"
												{...field}
												onChange={(e) => {
													field.onChange(
														e.target.value
													);
													if (
														parseFloat(
															e.target.value
														) < 0
													)
														form.setValue(
															"transactionType",
															"expense"
														);
													else
														form.setValue(
															"transactionType",
															"income"
														);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<ExpenseType type={Type} expense={expense} />
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input {...field} className="h-24" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Save changes</Button>
						{errorMessage && <Error message={errorMessage} />}
					</form>
				</Form>

				<DialogFooter></DialogFooter>
			</DialogContent>
		</>
	);
}
