import axios, { AxiosError } from "axios"
import { isEmpty, isUndefined } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { FETCH_MARKETS, FETCH_SUBMARKETS } from "./constants"

/**
 * @name useLocation
 * @description this hook is used to fetch location information, 
 *              e.g market( which is the country) and submarket(which is the city) which are required for the onboarding flow
 *              and perhaps later also for updating the user's profile
 * @returns {Object} - Object containing the current location
 */
export default function useLocation(market_id?: string) {
    const [marketsData, setMarketsData] = useState<{
        loading: boolean,
        error: AxiosError | null,
        data: null | {
            country: string;
            name: string;
            status: string;
            id: string;
        }[],
    }>({
        loading: false,
        error: null,
        data: null,
    })
    const [subMarkets, setSubMarkets] = useState<{
        loading: boolean,
        error: AxiosError | null,
        data: null | {
            market_id: string;
            id: string;
            name: string;
        }[]
    }>({
        loading: false,
        error: null,
        data: null,
    })

    /**
     * @name fetchMarkets markets (not setting up rtk cause of the boilerplate, plus there is no need for this to be part of global state)
     */
    const fetchMarkets = async ()=>{
        setMarketsData((prev)=>({
            ...prev,
            loading: true,
        }))
        // note the markets endpoint is public, so no need to pass the token
        await axios.get(FETCH_MARKETS,{
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        }).then(({data})=>{
            setMarketsData((prev)=>({
                ...prev,
                loading: false,
                data: data.data
            }))
        }).catch((e)=>{
            setMarketsData((prev)=>({
                ...prev,
                loading: false,
                error: e
            }))
        })
    }

    /**
     * @name fetchSubMarkets 
     */
    const fetchSubMarkets = async (market_id?: string)=>{
        setSubMarkets((prev)=>({
            ...prev,
            loading: true,
        }))
        // note the markets endpoint is public, so no need to pass the token
        await axios.get(FETCH_SUBMARKETS, {
            params: {
                market_id: market_id
            },
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        }).then(({data})=>{
            setSubMarkets((prev)=>({
                ...prev,
                loading: false,
                data: data.data
            }))
        }).catch((e)=>{
            setSubMarkets((prev)=>({
                ...prev,
                loading: false,
                error: e
            }))
        })
    }

    return {
        markets: marketsData,
        subMarkets: subMarkets,
        fetchMarkets,
        fetchSubMarkets
    }
}