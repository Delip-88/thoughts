import { Datagrid, List, TextField } from 'react-admin'

const UserList = () => {
  // const filteredList
  return (
    <List>
      <Datagrid>
        <TextField source='id' />
        <TextField source='name' />
        <TextField source='email' />
        <TextField source='phone' />
        <TextField source='username'/>
      </Datagrid>
    </List>
  )
}

export default UserList
