import { Hono } from "hono";

import users from "./users.json" with { type: "json" };

const user = new Hono().basePath("/user");

user.get("/", (ctx) => {
    let apiKey = ctx.req.header("xi-api-key");

    if (apiKey == null) {
        return ctx.json(
            {
                detail: {
                    status: "needs_authorization",
                    message:
                        "Neither authorization header nor xi-api-key received, please provide one."
                }
            },
            { status: 401 }
        );
    }

    apiKey = apiKey.toLowerCase();

    if (
        apiKey.length !== 51 || apiKey.slice(0, 3) !== "sk_" ||
        !/^[a-f0-9]+$/.test(apiKey.slice(3))
    ) {
        return ctx.json(
            {
                detail: {
                    status: "invalid_api_key",
                    message: "Invalid API key"
                }
            },
            { status: 401 }
        );
    }

    const user = users.find((val) => val.apiKey === apiKey);

    if (user == null) {
        return ctx.json(
            {
                detail: {
                    status: "api_key_not_verifiable",
                    message:
                        "400: {'status': 'invalid_api_key', 'message': 'API key is invalid'}"
                }
            },
            { status: 400 }
        );
    }

    console.log("User found! ID: ", user.id);

    return ctx.json(
        {
            user_id: user.id,
            subscription: {
                tier: "free",
                character_count: user.credits.limit - user.credits.available,
                character_limit: user.credits.limit,
                max_character_limit_extension: null,
                can_extend_character_limit: false,
                allowed_to_extend_character_limit: false,
                next_character_count_reset_unix: 1757170333,
                voice_slots_used: user.voiceSlots.limit -
                    user.voiceSlots.available,
                professional_voice_slots_used: 0,
                voice_limit: user.voiceSlots.limit,
                max_voice_add_edits: 54,
                voice_add_edit_counter: 0,
                professional_voice_limit: 0,
                can_extend_voice_limit: false,
                can_use_instant_voice_cloning: false,
                can_use_professional_voice_cloning: false,
                currency: null,
                status: "free",
                billing_period: "monthly_period",
                character_refresh_period: "monthly_period"
            },
            subscription_extras: null,
            is_new_user: true,
            xi_api_key: user.apiKey || null,
            can_use_delayed_payment_methods: false,
            is_onboarding_completed: true,
            is_onboarding_checklist_completed: true,
            first_name: user.firstName,
            is_api_key_hashed: false,
            xi_api_key_preview: null,
            referral_link_code: null,
            partnerstack_partner_default_link: null,
            created_at: user.createdAt
        },
        { status: 200 }
    );
});

export { user };
