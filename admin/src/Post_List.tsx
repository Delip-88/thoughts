import { Datagrid, List, TextField, ReferenceField, FunctionField, EditButton, TextInput, ReferenceInput } from 'react-admin'

const Post_List = () => {
    const filteredList = [<TextInput source='q' label="Search" alwaysOn/>, <ReferenceInput source='userId' label='User' reference='users'/>]
  return (
    <List filters={filteredList}>
        <Datagrid>
            <TextField source='id'/>
            <TextField source='title'/>
            <FunctionField label='Description' render={(record)=>`${record.body.substring(0,30)}...`}/>
            <ReferenceField source='userId' reference='users'/>
            <EditButton/>
        </Datagrid>

    </List>
      
  )
}

export default Post_List
