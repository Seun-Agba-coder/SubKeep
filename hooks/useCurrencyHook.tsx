import { useAppTranslation } from "./useAppTranslator";




const UseCurrencyHook = () => {
    const { t} = useAppTranslation()

    const CurrencyList   = [
        { "code": "USD", "symbol": "$",  "name": t('currencyPickerCurrencies.usd') },
        { "code": "EUR", "symbol": "€",  "name": t('currencyPickerCurrencies.eur') },
        { "code": "GBP", "symbol": "£",  "name": t('currencyPickerCurrencies.gbp') },
        { "code": "NGN", "symbol": "₦",  "name": t('currencyPickerCurrencies.ngn') },
        { "code": "JPY", "symbol": "¥",  "name": t('currencyPickerCurrencies.jpy') },
        { "code": "AUD", "symbol": "$",  "name": t('currencyPickerCurrencies.aud') },
        { "code": "CAD", "symbol": "$",  "name": t('currencyPickerCurrencies.cad') },
        { "code": "CHF", "symbol": "CHF","name": t('currencyPickerCurrencies.chf') },
        { "code": "CNY", "symbol": "¥",  "name": t('currencyPickerCurrencies.cny') },
        { "code": "INR", "symbol": "₹",  "name": t('currencyPickerCurrencies.inr') },
        { "code": "AED", "symbol": "د.إ", "name":t('currencyPickerCurrencies.aed') },
        { "code": "SAR", "symbol": "﷼",  "name": t('currencyPickerCurrencies.sar') },
        { "code": "ARS", "symbol": "$",  "name": t('currencyPickerCurrencies.ars') },
        { "code": "CLP", "symbol": "$",  "name": t('currencyPickerCurrencies.clp') },
        { "code": "COP", "symbol": "$",  "name": t('currencyPickerCurrencies.cop') },
        { "code": "PEN", "symbol": "S/","name":  t('currencyPickerCurrencies.pen') },
        { "code": "UAH", "symbol": "₴",  "name": t('currencyPickerCurrencies.uah') },
        { "code": "ZAR", "symbol": "R",  "name": t('currencyPickerCurrencies.zar') },
        { "code": "KES", "symbol": "KSh","name": t('currencyPickerCurrencies.kes') },
        { "code": "GHS", "symbol": "₵",  "name": t('currencyPickerCurrencies.ghs') },
        { "code": "BRL", "symbol": "R$", "name": t('currencyPickerCurrencies.brl') },
        { "code": "MXN", "symbol": "$",  "name": t('currencyPickerCurrencies.mxn') },
        { "code": "KRW", "symbol": "₩",  "name": t('currencyPickerCurrencies.krw') },
        { "code": "TRY", "symbol": "₺",  "name": t('currencyPickerCurrencies.try') },
        { "code": "SEK", "symbol": "kr", "name": t('currencyPickerCurrencies.sek') },
        { "code": "NOK", "symbol": "kr", "name": t('currencyPickerCurrencies.nok') },
        { "code": "DKK", "symbol": "kr", "name": t('currencyPickerCurrencies.dkk') },
        { "code": "RUB", "symbol": "₽",  "name": t('currencyPickerCurrencies.rub') },
        { "code": "PLN", "symbol": "zł", "name": t('currencyPickerCurrencies.pln') }
    
      ]

      return { CurrencyList}
   
}


export default UseCurrencyHook