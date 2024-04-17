import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"

const schema = z.object({
  inputAmount: z.number({
    required_error: "Input amount is required",
    invalid_type_error: "Input amount be a number",
  }),
  currency: z.string({
    required_error: "Currency is required",
    invalid_type_error: "Currency must be a string",
  }),
})

type Schema = z.infer<typeof schema>

type CurrencyType = {
  currency: string;
  date: string;
  price: number;
}

export default function SwapCurrency() {
  const { register, handleSubmit, formState, watch } = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  const onSubmit: SubmitHandler<Schema> = (data: Schema) => {
    console.log(data)
    const { inputAmount, currency } = data;
    setNewCurrencyAmount(inputAmount * Number(currency));
  }
  console.log("watch('inputAmount')", watch("inputAmount"))
  console.log("formState", formState)
  const [newCurrencyAmount, setNewCurrencyAmount] = useState<number | null>(null);
  const [currencyList, setCurrencyList] = useState<CurrencyType[]>([]);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then(res => res.json())
      .then(data => setCurrencyList(data));
  }, [])
  
  return (
    <div className="bg-[url(/public/currency-swap-bg.jpg)] bg-cover bg-no-repeat h-[300px] w-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center uppercase text-white font-semibold text-2xl pt-5 pb-12">
          <h5>Currency swap</h5>
        </div>
        <div className="border border-solid rounded-xl box-content max-w-fit ml-5 p-4 space-y-3">
          <div className="space-x-3 flex flex-row">
            <div className="flex flex-row">
              <label htmlFor="input-amount" className="text-white font-bold mr-1">Amount to send:</label>
              <div>
                <input id="input-amount" {...register("inputAmount", {
                  setValueAs: (value) => value ? Number(value) : undefined
                })} />
                <p className="text-red-600 text-sm">
                  {formState.errors.inputAmount?.message}
                </p>
              </div>
            </div>

            <div className="flex flex-row">
              <label htmlFor="select-currency" className="text-white mr-1">Select currency:</label>
              <div>
                <select id="select-currency" {...register("currency", {
                    setValueAs: (value: string) => value ? String(value) : undefined
                  })}>
                  <option disabled selected value={undefined}></option>
                  {currencyList.map((currency, index) => (
                    <option key={index} value={currency.price}>{currency.currency}</option>
                  ))}
                </select>
                <p className="text-red-600 text-sm">
                  {formState.errors.currency?.message}
                </p>
              </div>
            </div>
          </div>
      
          {newCurrencyAmount && (
            <p className="text-green-600">
              Amount to receive in the new currency: {newCurrencyAmount}
            </p>
          )}
          <button className="text-white bg-[#008CBA] p-3 rounded-xl font-semibold">CONFIRM SWAP</button>
        </div>
      </form>
    </div> 
    )
}