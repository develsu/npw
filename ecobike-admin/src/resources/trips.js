import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    Filter,
    ReferenceInput,
    SelectInput,
    DateInput
} from 'react-admin';

const TripFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput source="user_id" reference="users" label="Пользователь">
            <SelectInput optionText="email" />
        </ReferenceInput>
        <DateInput source="start_gte" label="С даты" />
        <DateInput source="end_lte" label="По дату" />
    </Filter>
);

export const TripList = (props) => (
    <List {...props} filters={<TripFilter />} sort={{ field: 'start_time', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <ReferenceField source="user_id" reference="users" label="Пользователь">
                <TextField source="email" />
            </ReferenceField>
            <NumberField source="distance_km" label="Расстояние (км)" />
            <NumberField source="duration_min" label="Время (мин)" />
            <DateField source="start_time" label="Начало" showTime />
            <DateField source="end_time" label="Конец" showTime />
        </Datagrid>
    </List>
);

export const TripShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <ReferenceField source="user_id" reference="users" label="Пользователь">
                <TextField source="email" />
            </ReferenceField>
            <NumberField source="distance_km" label="Расстояние (км)" />
            <NumberField source="duration_min" label="Время (мин)" />
            <DateField source="start_time" label="Начало" showTime />
            <DateField source="end_time" label="Конец" showTime />
        </SimpleShowLayout>
    </Show>
);

export default {
    list: TripList,
    show: TripShow
};
