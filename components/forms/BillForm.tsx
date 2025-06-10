import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { isEmpty } from "lodash-es";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ListContainer,
  RowContainer,
  RowLabel,
  RowSwitch,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  useTheme,
} from "react-native-orchard";
import { z } from "zod";

export const billSchema = z
  .object({
    name: z.string().min(1, "Name is required").default(""),
    amount: z
      .string()
      .nonempty("Amount is required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a valid number",
      })
      .transform((val) => Number(val))
      .refine((val) => val > 0, {
        message: "Amount must be greater than 0",
      })
      .default(""),
    autoPay: z.boolean().default(false),
    dueEvery: z.enum(["monthly", "yearly"]).default("monthly"),
    dueDate: z.date().default(new Date()),
  })
  .required();

export type BillFormSchema = z.infer<typeof billSchema>;
export type BillFormStringSchema = Omit<BillFormSchema, "amount"> & {
  amount: string;
};

export interface BillFormProps {
  onSubmit: (data: BillFormSchema) => void;
  submitLabel?: string;
  defaultValues?: Partial<BillFormStringSchema>;
}

export function BillForm({
  onSubmit,
  submitLabel = "Create",
  defaultValues = {
    name: "",
    amount: "",
    autoPay: false,
    dueEvery: "monthly",
    dueDate: new Date(),
  },
}: BillFormProps) {
  const { spacing } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(billSchema),
  });

  return (
    <ListContainer>
      <SectionContainer>
        <SectionContent>
          <RowContainer>
            <RowLabel>Name</RowLabel>
            <RowTrailing>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <RowTextInput
                    placeholder="Enter Name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    style={{
                      fontSize: 16,
                    }}
                  />
                )}
              />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Amount</RowLabel>
            <RowTrailing>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <RowTextInput
                    placeholder="Enter Amount"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                    value={value}
                    style={{
                      fontSize: 16,
                    }}
                  />
                )}
              />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Auto Pay</RowLabel>
            <RowTrailing>
              <Controller
                control={control}
                name="autoPay"
                render={({ field: { onChange, value } }) => (
                  <RowSwitch onValueChange={onChange} value={value} />
                )}
              />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Due Every</RowLabel>
            <RowTrailing>
              <Controller
                control={control}
                name="dueEvery"
                render={({ field: { onChange, value } }) => (
                  <SegmentedControl
                    values={["Monthly", "Yearly"]}
                    selectedIndex={value === "monthly" ? 0 : 1}
                    onValueChange={(value) =>
                      onChange(value === "Monthly" ? "monthly" : "yearly")
                    }
                    style={{ flex: 1, marginVertical: -1 * spacing.xs }}
                  />
                )}
              />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Due Date</RowLabel>
            <RowTrailing>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    onChange={(_event, date) => {
                      if (date) {
                        onChange(date);
                      }
                    }}
                    value={value ?? new Date()}
                    mode="date"
                    display="compact"
                    style={{
                      marginVertical: -1 * spacing.xs,
                    }}
                  />
                )}
              />
            </RowTrailing>
          </RowContainer>
        </SectionContent>
      </SectionContainer>
      <Button
        onPress={handleSubmit(onSubmit)}
        variant={isEmpty(errors) ? "filled" : "tinted"}
      >
        {submitLabel}
      </Button>
    </ListContainer>
  );
}
