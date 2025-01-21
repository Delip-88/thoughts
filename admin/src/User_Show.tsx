import { EmailField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="phone" />
        </SimpleShowLayout>
    </Show>
);