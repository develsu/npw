import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Show,
    SimpleShowLayout,
    Filter,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    DateInput
} from 'react-admin';

const ExchangeFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput source="user_id" reference="users" label="Пользователь">
            <SelectInput optionText="email" />
        </ReferenceInput>
        <ReferenceInput source="station_id" reference="stations" label="Станция">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <DateInput source="created_at_gte" label="С даты" />
        <DateInput source="created_at_lte" label="По дату" />
    </Filter>
);

export const ExchangeList = (props) => (
    <List {...props} filters={<ExchangeFilter />} sort={{ field: 'created_at', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <ReferenceField source="user_id" reference="users" label="Пользователь">
                <TextField source="email" />
            </ReferenceField>
            <ReferenceField source="station_id" reference="stations" label="Станция">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="old_battery_id" reference="batteries" label="Старая батарея">
                <TextField source="serial_number" />
            </ReferenceField>
            <ReferenceField source="new_battery_id" reference="batteries" label="Новая батарея">
                <TextField source="serial_number" />
            </ReferenceField>
            <DateField source="created_at" label="Дата обмена" showTime />
        </Datagrid>
    </List>
);

export const ExchangeShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <ReferenceField source="user_id" reference="users" label="Пользователь">
                <TextField source="email" />
            </ReferenceField>
            <ReferenceField source="station_id" reference="stations" label="Станция">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="old_battery_id" reference="batteries" label="Старая батарея">
                <TextField source="serial_number" />
            </ReferenceField>
            <ReferenceField source="new_battery_id" reference="batteries" label="Новая батарея">
                <TextField source="serial_number" />
            </ReferenceField>
            <DateField source="created_at" label="Дата обмена" showTime />
        </SimpleShowLayout>
    </Show>
);