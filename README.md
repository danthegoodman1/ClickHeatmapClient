# Clickhouse example for associating events with pageviews and such

```sql
CREATE TABLE rows_to_array (
	view_id String DEFAULT '',
	interaction_id String DEFAULT '',
	event_id String DEFAULT '',
) ENGINE = Memory()
;

INSERT INTO rows_to_array  (view_id, interaction_id, event_id) VALUES
('1', 'a', 'hover'),
('1', 'a', 'leave'),
('1', 'b', 'hover'),
('1', 'b', 'click'),
('1', 'b', 'leave'),
('1', 'c', 'hover'),
('1', 'c', 'click')
;

SELECT * FROM rows_to_array ;

SELECT view_id, groupArray(event_id) FROM rows_to_array group by view_id;
SELECT view_id, interaction_id, groupArray(event_id) FROM rows_to_array group by view_id, interaction_id;

DROP TABLE rows_to_array;
```
