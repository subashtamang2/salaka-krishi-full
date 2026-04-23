import type { ContactFormProps } from "@src/components/ContactForm";
import axios from "@utils/axios-interceptor";
import urls from "./urls";
export function addContact(data: ContactFormProps) {
    return axios({
        url: urls.contact.url,
        method: urls.contact.method,
        data,

    })
}
