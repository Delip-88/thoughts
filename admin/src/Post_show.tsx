import { ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <ReferenceField source="userId" reference="users" />
        </SimpleShowLayout>
    </Show>
);