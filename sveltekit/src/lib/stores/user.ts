import type { User } from "@supabase/supabase-js";
import { readable } from "svelte/store";
import { supabase } from "../supabase";

export const user = readable<User | null>(null, (set) => {
    supabase.auth.getUser().then(({ data }) => {
        if (data) {
            set(data.user)
        }
    })

    const sub = supabase.auth.onAuthStateChange((event, session) => {
        if(event === "SIGNED_IN") {
            set(session?.user ?? null);
        } else {
            set(null)
        }
    });

    return () => sub.data.subscription.unsubscribe();
});